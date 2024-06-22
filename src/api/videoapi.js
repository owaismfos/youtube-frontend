import axiosInstance from './axios';

export class VideoService {
    async getVideos() {
        try {
            const response = await axiosInstance.get('/videos/all-videos');
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async getVideo(videoId) {
        try {
            const response = await axiosInstance.get(`/videos/get-video/${videoId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async getViews(videoId) {
        try {
            const response = await axiosInstance.get(`/videos/get-views/${videoId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async postView(videoId) {
        try {
            const response = await axiosInstance.post(`/videos/update-views/${videoId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async uploadVideo(video) {
        try {
            const response = await axiosInstance.post('/videos/upload-video', video);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async getComments(videoId) {
        try {
            const response = await axiosInstance.get(`/videos/get-comments/${videoId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async postComment(videoId, comment) {
        try {
            const response = await axiosInstance.post(`/videos/comment/${videoId}`, {'comment': comment});
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async getVideoLikes(videoId) {
        try {
            const response = await axiosInstance.get(`/videos/likes/${videoId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async likeVideo(videoId) {
        try {
            const response = await axiosInstance.post(`/videos/like-video/${videoId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async unlikeVideo(videoId) {
        try {
            const response = await axiosInstance.post(`/videos/unlike-video/${videoId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async getSubscribeChannelsListOfCurrentUser() {
        try {
            const response = await axiosInstance.get(`/videos/get-subscribe-channels-list-of-current-user`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async getChannel(channelName) {
        try {
            const response = await axiosInstance.get(`/videos/channel/${channelName}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async getVideosOfChannel(channelId) {
        try {
            const response = await axiosInstance.get(`/videos/get-videos-of-channel/${channelId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }
}

const videoService = new VideoService();

export default videoService;