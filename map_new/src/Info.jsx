import { useState } from "react"


export default function Info ({name, disc}) {
    const [textNeeded, setTextNeeded] = useState('');
    
    const changeListener = (e) => {
        setTextNeeded(e.target.value)
    }
    
    const clickListener = () => {
        console.log(textNeeded)
        setTextNeeded('')
    }
    return(
        <div className='bg-info bg-gradient container col-4'>
            <div className=' bg-info bg-gradient rounded mt-5 pt-2 pb-2'>
            {name ? <p className="fs-1 text-center text-uppercase">{name}</p> : <p className="fs-1 text-center text-uppercase">Выберите область</p>}
            </div>
            
            <div className=' bg-info bg-gradient rounded'>
            {disc ? <p className="fs-5 text-center text-uppercase">{disc}</p> : <p className="fs-1 text-center text-uppercase">Выберите область</p>}
            </div>
            
            <form>
                <input type="text" onChange={changeListener} value={textNeeded}>
                </input>
                <div onClick={clickListener}>Отправить</div>
            </form>
        </div> 
        )
}
