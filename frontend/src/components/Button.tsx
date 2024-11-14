
export const Button = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => {
    return <button onClick={onClick} className="px-8  py-4 text-2xl text-white bg-green-500 hover:bg-green-700 textwhite font-bold py-2 rounded">
        {children}
    </button>
}