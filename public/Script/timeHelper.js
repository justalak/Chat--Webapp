function monthToString(month) {
    switch (month) {
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
    var now = new Date();
    var time = new Date(dateTime);
    if (now.getDay() == time.getDay() && now.getMonth() == time.getMonth()) {
        var hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        var minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        return hours + ':' + minutes;
    }
    else return monthToString(time.getMonth()) + ' ' + time.getDate();
}

function formatDate(today) {
   
    var day = today.getDate() + "";
    var month = (today.getMonth() + 1) + "";
    var year = today.getFullYear() + "";
    var hour = today.getHours() + "";
    var minutes = today.getMinutes() + "";
    var seconds = today.getSeconds() + "";

    day = checkZero(day);
    month = checkZero(month);
    year = checkZero(year);
    hour = checkZero(hour);
    mintues = checkZero(minutes);
    seconds = checkZero(seconds);

   return (day + "/" + month + "/" + year + " " + hour + ":" + minutes );

}
function checkZero(data) {
    if (data.length == 1) {
        data = "0" + data;
    }
    return data;
}