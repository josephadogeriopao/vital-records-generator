import { getMonth } from './getMonth';

export const getDate = (text: string) : string => {
    let day = text.substring(2,2);
    let month = getMonth(text.substring(0,2));
    let year = text.substring(4,4);   
  
    return `${day}-${month}-${year}`;
}
