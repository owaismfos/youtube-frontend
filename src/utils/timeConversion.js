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

const unixToTime = (unixTimestamp) => {
    if (!unixTimestamp || typeof unixTimestamp !== 'number') {
      return ''; // Or you could return a default like '00:00 AM'
    }
    const date = new Date(unixTimestamp * 1000);

    const formatedTime = date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return formatedTime;
}

const groupMessagesByDate = (messages) => {
  if (!messages || messages.length === 0) {
    return [];
  }

  const getLabel = (messageDate, today) => {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Reset time part for accurate date comparison
    messageDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    if (messageDate.getTime() === today.getTime()) {
      return "Today";
    }
    if (messageDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }
    
    // Check for current week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday as start
    if (messageDate >= startOfWeek) {
        return messageDate.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Monday"
    }

    // Check for current year
    if (messageDate.getFullYear() === today.getFullYear()) {
        return messageDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }); // "September 6"
    }

    // Older messages
    return messageDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); // "August 5, 2024"
  };

  const grouped = messages.reduce((acc, msg) => {
    // IMPORTANT: new Date() automatically uses the user's local timezone
    const messageDate = new Date(msg.insertedAt * 1000);
    const today = new Date();
    const label = getLabel(new Date(messageDate), today); // Pass a copy to avoid mutation

    if (!acc[label]) {
      acc[label] = [];
    }
    acc[label].push(msg);
    return acc;
  }, {});

  // Convert the grouped object to the final array format
  return Object.keys(grouped).map(date => ({
    date,
    messages: grouped[date],
    total: grouped[date].length
  }));
};

const getLabelForDate = (messageDate) => {
  // 1. Initial setup and defensive check
  if (!messageDate || !(messageDate instanceof Date)) {
    return ''; // Return an empty string if the date is invalid
  }

  const now = new Date();

  // 2. Create copies with time zeroed out for accurate date-only comparison
  const today = new Date(now.setHours(0, 0, 0, 0));
  const yesterday = new Date(new Date().setDate(today.getDate() - 1)).setHours(0, 0, 0, 0);
  const messageDateOnly = new Date(messageDate.setHours(0, 0, 0, 0));

  // 3. Perform comparisons in order of precedence
  
  // Is the message from today?
  if (messageDateOnly.getTime() === today.getTime()) {
    return "Today";
  }

  // Is the message from yesterday?
  if (messageDateOnly.getTime() === new Date(yesterday).getTime()) {
    return "Yesterday";
  }

  // Is the message from the current week?
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Assuming Monday is the start of the week
  if (messageDateOnly >= startOfWeek) {
    // Return the full day name, e.g., "Monday"
    return new Date(messageDateOnly).toLocaleDateString(undefined, { weekday: 'long' });
  }
  
  // Is the message from the current year?
  if (new Date(messageDateOnly).getFullYear() === new Date(now).getFullYear()) {
    // Return the month and day, e.g., "September 6"
    return new Date(messageDateOnly).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
  }

  // If none of the above, it's an older message from a previous year
  // Return the full date, e.g., "August 5, 2024"
  return new Date(messageDateOnly).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

export {
    secondsToTime,
    timeSinceUpload,
    formatDate,
    unixToTime,
    groupMessagesByDate,
    getLabelForDate
}

