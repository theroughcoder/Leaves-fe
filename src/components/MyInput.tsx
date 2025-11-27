import type React from "react";

// type MyButtonType = {
//     text: string
// }
interface MyInputType {
    text: string;
    disable : boolean | string; // This is or feature
    onClick?: ()=> void; //this is optional prop
}
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
}
const MyInput: React.FC<MyInputType> = (props) => {
    return <input onChange={handleChange}>{props.text}</input>
}