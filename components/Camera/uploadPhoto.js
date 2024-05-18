import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {app} from '../../auth/firebase';

const uploadPhoto = async (uri) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, 'images/' + new Date().getTime());

    try {
        const blob = await fetch(uri).then((r) => r.blob());

        const snapshot = await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log(downloadURL)

        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export default uploadPhoto;
