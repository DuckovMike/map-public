export default function Obl( {obl} ) {
    return(
        <>
            <div id="region">
                <p>{obl.name}</p>
                <hr />
                <p>{obl.disc}</p>
                <p>ID: {obl.id}</p>
            </div>
        </>
    )
}