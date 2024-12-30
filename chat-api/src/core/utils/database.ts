import mongoose from "mongoose";

const toObjectId = (id: string) => {
    return new mongoose.Types.ObjectId(id);
}

const toObjectIds = (ids: string[]) => {
    return ids.map(toObjectId);
}

const objectIdToString = (id: mongoose.Types.ObjectId) => {
    return id?.toString();
}

const objectIdsToStrings = (ids: mongoose.Types.ObjectId[]) => {
    return ids.map(objectIdToString);
}

const DatabaseUtils = {
    toObjectId,
    toObjectIds,
    objectIdToString,
    objectIdsToStrings
};
export default DatabaseUtils;
