
const Error = ({children}) => {
    return (
        <div className="w-full px-3 py-2 rounded-lg border-2 border-red-400 bg-red-100 text-red-500 flex items-center">
            <i className="pi pi-info-circle -rotate-180 rounded-full bg-red-500 text-white mr-1" style={{ fontSize: '20px' }} ></i>
            <label id='error'>{children}</label>
        </div>
    )
}

export default Error