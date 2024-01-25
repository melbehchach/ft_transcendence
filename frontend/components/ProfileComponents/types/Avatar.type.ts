export type AvatarProps = {
    src: string;
    width?: number;
    height?: number;
    userName: string;
    imageStyle: string;
    positiosn: boolean
    fontSize: string;
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
