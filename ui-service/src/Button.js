function Button({className, onClick}){
    return(
        <div>
            <button className={className} onClick={onClick}>Click me!!!</button>
        </div>
    );
}

export default Button;