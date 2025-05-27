
export const AppLayout = ({children}) => {
    return (
        // divide the screen into two columns one 300px wide and the other taking the rest of the space
        // using Tailwind CSS
        <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">          
            <div className="flex flex-col text-white overflow-hidden" >
                <div className="bg-slate-800">
                    <div>log</div>
                    <div>cta</div>
                    <div>tokens</div>
                </div>
                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-800 to-cyan-800">
                    list of posts
                </div>
                <div className="bg-cyan-800">
                    user information - logout button
                </div>
            </div>
            <div>{children}</div>
        </div>

    )
}