function monthToString(month) {
    switch(month){
        case 0: return 'Jan';
        case 1: return 'Feb';
        case 2: return 'Mar';
        case 3: return 'Apr';
        case 4: return 'May';
        case 5: return 'Jun';
        case 6: return 'Jul';
        case 7: return 'Aug';
        case 8: return 'Sep';
        case 9: return 'Oct';
        case 10: return 'Nov';
        case 11: return 'Dec';
    }
}

function calculateTime(dateTime) {
    var now=new Date();
    var time=new Date(dateTime);
    if(now.getDay()==time.getDay()&& now.getMonth()==time.getMonth())
        return time.getHours()+':'+time.getMinutes();
    else return monthToString(time.getMonth())+' '+time.getDate();
}