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


  const formatDate = (dateString) => {
    // Parse the UTC date string into a Date object
    const utcDate = new Date(dateString);
  
    // Convert UTC to IST by adding the offset (IST is UTC + 5:30)
    const istOffset = 5 * 60 + 30; // IST offset in minutes
    const istDate = new Date(utcDate.getTime() + istOffset * 60 * 1000);
  
    // Current date and "yesterday" in IST
    const now = new Date();
    const istNow = new Date(now.getTime());
  
    const istYesterday = new Date(istNow);
    istYesterday.setDate(istNow.getDate() - 1);
  
    // Check if the date is today
    if (istDate.toDateString() === istNow.toDateString()) {
      const hours = istDate.getHours().toString().padStart(2, "0");
      const minutes = istDate.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    // Check if the date is yesterday
    else if (istDate.toDateString() === istYesterday.toDateString()) {
      const hours = istDate.getHours().toString().padStart(2, "0");
      const minutes = istDate.getMinutes().toString().padStart(2, "0");
      return `Yesterday, ${hours}:${minutes}`;
    }
    // Otherwise, return the full date in DD/MM/YYYY format and time in HH:MM format
    else {
      const dateFormatted = istDate.toLocaleDateString("en-IN");
      const hours = istDate.getHours().toString().padStart(2, "0");
      const minutes = istDate.getMinutes().toString().padStart(2, "0");
      return `${dateFormatted}, ${hours}:${minutes}`;
    }
};

export {
    secondsToTime,
    timeSinceUpload,
    formatDate,
}

