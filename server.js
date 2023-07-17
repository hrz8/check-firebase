import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import upload from 'express-fileupload';
import cors from 'cors';

import { storage } from './firebase.js';
import { ref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage";

const app = express();

app.use(cors());
app.use(upload());
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

app.post('/upload', async function(req, res) {
    if (!req.files || !req.files?.image) {
        res.status(400);
        res.json({
            ok: false,
        });

        return;
    }

    if (req.files.image.mimetype !== 'image/jpeg' || req.files.image.size > 1000000) {
        res.status(400);
        res.json({
            ok: false,
        });

        return;
    }

    const buffer = req.files.image.data;
    const filenameSplitted = req.files.image.name.split('.');
    const ext = filenameSplitted[filenameSplitted.length - 1];
    // const bytes = new Uint8Array(buffer);
    const base64 = `data:image/jpeg;base64,${Buffer.from(buffer, 'base64').toString('base64')}`;

    const fileName = `${new Date().getTime()}.${ext}`;
    const storageRef = ref(storage, fileName);
    // const uploaded = await uploadBytes(storageRef, bytes, {
    //     contentType: 'image/jpeg',
    // });

    const uploaded = await uploadString(storageRef, base64, 'data_url', {
        contentType: 'image/jpeg',
    });

    const url = await getDownloadURL(uploaded.ref);

    res.json({
        ok: true,
        url,
    });
});

app.listen(process.env.PORT, function() {
    console.info(`server start in port ${process.env.PORT}`);
});
