import React,{ useState} from 'react';
import './App.css'
import ReactFlow, {Controls} from 'react-flow-renderer';
import Form from './Components/Form'
import highlightnodes from './functions/hilightnodes.js'
import snapnodes from './functions/snapnodes.js'
import Popup from "./popup.js";
import customNode from "./customNode";

const CISE_Courses=require('./data/Courses.js');
const initialElements=require('./data/InitialElements');
const snapLocation=require('./data/SnapLocations.js');
const nodeTypes = {
    custom: customNode
}

const majorSelection=[{id: 'Major Selection', type: 'custom',data:{label: 'Please select your major: '},position:{x:850,y:100}, draggable: false, selectable: false}];

const snapDistance=[]
const courseInfo = []

const App = () => {
//pop up const
const [buttonPopup, setButtonPopup] = useState(false);

//node const
const [elements,setElements]=useState(initialElements);
const [inputText,setInputText] = useState("");

const handleNodeMouseEnter = (event,node) => {
  var index = CISE_Courses.findIndex(x=> x.code===node.id)
  if(index!==-1)
  {
    let temp= CISE_Courses[index].preReqs.slice(0)
    let prereqs = new Set(temp)
    while(temp.length)
    {
        let temp2=temp.pop()
        let next = CISE_Courses[CISE_Courses.findIndex(x=> x.code===temp2)].preReqs
        temp=temp.concat(next)
        prereqs.add(temp2)
        
    }
    setElements(highlightnodes(elements,prereqs));
  }
}
const handleNodeMouseLeave = (event,node) => {
  var index = CISE_Courses.findIndex(x=> x.code===node.id)
  if(index!==-1)
  {
    var prereqs= new Set(CISE_Courses[index].preReqs)
    setElements(highlightnodes(elements,prereqs));
  }
}
const handleNodeDrag = (event, node) => {
  var index = elements.findIndex(x=> x.id===node.id)
  elements[index].position=node.position
}
function doSomething(elements,node)
{
    const newElements = elements.map((e) => {
        if(e.id === node.id)
        {
            return{...e,position:{x:node.position.x-1,y:node.position.y-1}}
        }
        else
        {
            return{...e}
        }

    })
    return newElements;
}
const handleNodeMouseDrop = (event, node) => {
    setElements(doSomething(elements,node))
    setElements(snapnodes(elements,snapDistance,snapLocation,node))
}
const handleNodeDoubleClick = (event, element) => {
    //put code here for right click info thing
    //console.log('click', element);
    courseInfo.length = 0;
    for(let i=0; i < CISE_Courses.length; i++){
        if(CISE_Courses.at(i).code === element.id){
            courseInfo.push({
                cId: CISE_Courses.at(i).code,
                cName: CISE_Courses.at(i).name,
                cCred: CISE_Courses.at(i).credit,
                cDes: CISE_Courses.at(i).description,
                cReq: CISE_Courses.at(i).yearReq
            })
        }
    }
    if(courseInfo.length === 0){
        console.log("Class info not found")
    }
    setButtonPopup(true);
}

  return (
      <div className="App">
          <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
              {courseInfo.map(function(c, hd){
                  return (
                      <h2 key={hd}>{c.cId + " " + c.cName}</h2>
                  )
              })}
              {courseInfo.map(function(c, crd){
                  return (
                      <h3 key={crd}>{"Credits: " + c.cCred}</h3>
                  )
              })}
              {courseInfo.map(function(c, yr){
                  return (
                      <h3 key={yr}>{"Year Requirement: " + c.cReq}</h3>
                  )
              })}
              {courseInfo.map(function(c, bd){
                  return (
                      <p key={bd}>{c.cDes}</p>
                  )
              })}
          </Popup>
        <Form setInputText={setInputText} inputText={inputText} elements={elements} setElements={setElements}/>
        <div style={{height: 700}}>
              <ReactFlow elements={elements} onNodeMouseEnter={handleNodeMouseEnter} onNodeMouseLeave={handleNodeMouseLeave} onNodeDragStop={handleNodeMouseDrop}  onNodeDoubleClick={handleNodeDoubleClick} onPaneClick={() => setButtonPopup(false)} nodeTypes={nodeTypes}>
              <Controls/> 
              </ReactFlow>
        </div>
      </div>
  );
}

export default App;
