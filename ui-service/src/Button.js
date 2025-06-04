function Button({className, onClick}){
    return(
        <div>
            <button className={className} onClick={onClick}>Hello it finally worked</button>
        </div>
    );
}

export default Button;