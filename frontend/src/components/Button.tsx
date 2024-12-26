
export const Button = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => {
    return <button onClick={onClick} className="flex px-8  py-4 gap-2 text-2xl items-center text-white bg-green-500 hover:bg-green-700 textwhite font-bold py-2 rounded">
        {children}
    </button>
}