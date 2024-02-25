export type AvatarProps = {
    src: string;
    width?: number;
    height?: number;
    userName: any;
    imageStyle: string;
    fontSize: string;
    positiosn: boolean
}


// Profile data 
export type DataFetch = {
    id: string,
    username: string,
    avatar: string,
    friends?: [],
    sentRequests?: [],
    friendRequests?: [],
    sentMessages?: [],
    receivedMessages?: [],
    ChannelsOwner?: [],
    ChannelsAdmin?: [],
    ChannelsMember?: [],
    ChannelsBannedFrom?: [],
}


// Search data
export type ProfileData = {
    id: string,
    username: string,
    avatar: string,
}

export type SearchDataFetch = {
    users: ProfileData[],
    channels: []
}
