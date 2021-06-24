import data from "../data.json"

export const convert = (year,month,date) =>{
    return new Date(`${year}.${month}.${date}`).getTime() / 1000
}

export const stripTime = (unix) =>{
    let date = new Date(unix*1000);
    let date2 = date.setHours(0,0,0,0);
    return date2
}

export const formatUnix = () =>{
    let newArr = [];
    data.forEach((d) => {      
        const isPresent = newArr.findIndex((el) => stripTime(d.date?.time)*1000== el?.date);
        if (isPresent == -1) {
          newArr.push({
            date: stripTime(d.date?.time)*1000,
            events: [d],
          });
        } else {
          newArr[isPresent].events.push(d);
        }
      });
      return newArr
}