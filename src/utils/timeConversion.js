const secondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Format the time as HH:MM:SS
    let formattedTime = "";
    if (seconds >= 3600) {
        formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
    } else {
        formattedTime = `${padZero(minutes)}:${padZero(remainingSeconds)}`;
    }

    return formattedTime;
}

const padZero = (number) => {
    return number < 10 ? `0${number}` : number;
}

const timeSinceUpload = (uploadTime) => {
    const currentTime = new Date();
    const uploadDate = new Date(uploadTime);
    const timeDifference = Math.abs(currentTime - uploadDate);
  
    // Convert time difference to appropriate units
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
  
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
  }

export {
    secondsToTime,
    timeSinceUpload,
}