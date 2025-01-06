// Icons import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessRook } from '@fortawesome/free-solid-svg-icons';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

// Images Import
// import logo from "../../../TQ-1.jpg"
import logo from "../../../TQ-2.jpg"

export const Sidebar = () => {

    // const navigate = useNavigate();

    return (
        <div className='w-[10%] fixed h-full flex-col gap-2 text-white lg:flex'>
            <div className='bg-[#232121] h-screen pt-2 rounded flex flex-col gap-4'>

                {/* <div className='flex items-center h-6 gap-2 pl-8 cursor-pointer hover:bg-[#403B3B]'>
                    <img src={logo} alt="Org LOGO" />
                </div> */}

                <div className='flex items-center h-15 w-50 gap-2 cursor-pointer hover:bg-[#403B3B]'>
                    <img src={logo} alt="Org LOGO" className="max-h-full max-w-full object-contain" />
                </div>


                <div className="flex items-center gap-2 pl-8 cursor-pointer hover:bg-[#403B3B]"
                    onMouseEnter={(e) => {
                        const iconElement = e.currentTarget.querySelector('svg');
                        if (iconElement) iconElement.classList.add('fa-bounce');
                    }}
                    onMouseLeave={(e) => {
                        const iconElement = e.currentTarget.querySelector('svg');
                        if (iconElement) iconElement.classList.remove('fa-bounce');
                    }}
                >
                    <FontAwesomeIcon icon={faChessRook} />
                    <p className="font-bold">Play</p>
                </div>

                <div className="flex items-center gap-2 pl-8 cursor-pointer hover:bg-[#403B3B]"
                    onMouseEnter={(e) => {
                        const iconElement = e.currentTarget.querySelector('svg');
                        if (iconElement) iconElement.classList.add('fa-bounce');
                    }}
                    onMouseLeave={(e) => {
                        const iconElement = e.currentTarget.querySelector('svg');
                        if (iconElement) iconElement.classList.remove('fa-bounce');
                    }}
                >
                    <FontAwesomeIcon icon={faPuzzlePiece} />
                    <p className="font-bold">Puzzels</p>
                </div>

                <div className="flex items-center gap-2 pl-8 cursor-pointer hover:bg-[#403B3B]"
                    onMouseEnter={(e) => {
                        const iconElement = e.currentTarget.querySelector('svg');
                        if (iconElement) iconElement.classList.add('fa-bounce');
                    }}
                    onMouseLeave={(e) => {
                        const iconElement = e.currentTarget.querySelector('svg');
                        if (iconElement) iconElement.classList.remove('fa-bounce');
                    }}
                >
                    <FontAwesomeIcon icon={faGraduationCap} />
                    <p className="font-bold">Learn</p>
                </div>

                <div className="flex items-center gap-2 pl-8 cursor-pointer hover:bg-[#403B3B]"
                    onMouseEnter={(e) => {
                        const iconElement = e.currentTarget.querySelector('svg');
                        if (iconElement) iconElement.classList.add('fa-bounce');
                    }}
                    onMouseLeave={(e) => {
                        const iconElement = e.currentTarget.querySelector('svg');
                        if (iconElement) iconElement.classList.remove('fa-bounce');
                    }}
                >
                    <FontAwesomeIcon icon={faEye} />
                    <p className="font-bold">Watch</p>
                </div>

                <div className="flex items-center gap-2 pl-8 cursor-pointer hover:bg-[#403B3B]"
                    onMouseEnter={(e) => {
                        const iconElement = e.currentTarget.querySelector('svg');
                        if (iconElement) iconElement.classList.add('fa-bounce');
                    }}
                    onMouseLeave={(e) => {
                        const iconElement = e.currentTarget.querySelector('svg');
                        if (iconElement) iconElement.classList.remove('fa-bounce');
                    }}
                >
                    <FontAwesomeIcon icon={faNewspaper} />
                    <p className="font-bold">News</p>
                </div>

                <div className="flex items-center gap-2 pl-8 cursor-pointer hover:bg-[#403B3B]"
                    onMouseEnter={(e) => {
                        const iconElement = e.currentTarget.querySelector('svg');
                        if (iconElement) iconElement.classList.add('fa-bounce');
                    }}
                    onMouseLeave={(e) => {
                        const iconElement = e.currentTarget.querySelector('svg');
                        if (iconElement) iconElement.classList.remove('fa-bounce');
                    }}
                >
                    <FontAwesomeIcon icon={faUsers} />
                    <p className="font-bold">Social</p>
                </div>
            </div>
        </div>
    )
}