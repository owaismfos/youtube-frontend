import axiosInstance from './axios';

class ChannelService {
    async createChannel(data) {
        try {
            const response = await axiosInstance.post('/channels/create-channel', data);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async getChannelDetails() {
        try {
            const response = await axiosInstance.get('/channels/get-channel-details')
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async getChannelDetailsById(channelId) {
        try {
            const response = await axiosInstance.get(`/channels/get-channel-details-by-id/${channelId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async getSubscribers(channelId) {
        try {
            const response = await axiosInstance.get(`/subscribers/get-subscribers/${channelId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async subscribeChannel(channelId) {
        try {
            const response = await axiosInstance.post(`/subscribers/subscribe-channel/${channelId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async unsubscribeChannel(channelId) {
        try {
            const response = await axiosInstance.post(`subscribers/unsubscribe-channel/${channelId}`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async getSubscribeChannelsListOfCurrentUser() {
        try {
            const response = await axiosInstance.get(`/subscribers/get-subscribe-channels-list-of-current-user`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async uploadChannelBackgroundImage(formData) {
        try {
            const response = await axiosInstance.post('/channels/upload-channel-background-image', formData);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async uploadChannelAvatarImage(formData) {
        try {
            const response = await axiosInstance.post('/channels/upload-channel-avatar-image', formData);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async changeChannelName(channelName) {
        try {
            const response = await axiosInstance.post('/channels/change-channel-name', {
                'channelName': channelName
            });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }
}

const channelService = new ChannelService();

export default channelService;