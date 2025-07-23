

function InputField(props){
return(
     props.type==='select'?( <select name={props.name} value={props.value} onChange={props.onChange}>
          <option value="">Select {props.label}</option>
          {props.options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      ):

    
     <input type={props.type} name={props.name} value={props.value} onChange={props.onChange}  disabled={props.disabled}/> 
)
}
export default InputField;