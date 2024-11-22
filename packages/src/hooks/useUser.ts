import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';

export const useUser = () => {
    const value = useRecoilValue(userAtom);
    return value;
}