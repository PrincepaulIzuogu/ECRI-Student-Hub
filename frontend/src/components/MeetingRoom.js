// MeetingRoom.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MeetingRoom = () => {
  const { meetingId } = useParams();
  const [meetingUrl, setMeetingUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const startMeetingNow = async () => {
      try {
        const response = await axios.post(`https://ecristudenthub-backend.azurewebsites.net/start-meeting/${meetingId}`);
        setMeetingUrl(response.data.meeting_url);
        window.location.href = response.data.meeting_url;
      } catch (err) {
        setError('Failed to start meeting. Please try again.');
      }
    };

    startMeetingNow();
  }, [meetingId]);

  return (
    <div>
      <h2>Starting Meeting...</h2>
      {error && <p>{error}</p>}
    </div>
  );
};

export default MeetingRoom;
