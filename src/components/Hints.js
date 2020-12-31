import React from 'react';
import { Header } from 'semantic-ui-react';
import ReactAudioPlayer from 'react-audio-player';

// Hints for questions with text only
export const TextHint = ({ hint }) => {
    return <Header as='h3' dividing>
        { hint }
    </Header>
}

const SoundPlayer = (path) => <ReactAudioPlayer src={ path } controls/>;

// Hint for questions that needs audio files
export const SoundHint = ({hint, path}) => {
    const lines = hint.split('。');
    return <div>
            <Header as='h3' dividing>
                { lines.map((line, idx) => <p key={ idx }>{ line }<br /></p>) }
            </Header>
            { SoundPlayer(path) }
        </div>;
}

// const ImageModal = (src) => {
//     return <Modal key={ src } trigger={ <Card raised image={ src } /> } closeIcon>
//         <Image centered={true} size='big' src={ src } />
//     </Modal>;
// }

// Hint for questions that needs to display images
// export const PictureHint = ({hint, path}) => {
//     const urlPath = path.replace(/^../g, '');
//     const [filePrefix, fileNum] = path.replace(/^.*\//g, '').split('-');
//     let images = [];
//     for (let i = 1; i <= fileNum; i++) {
//         const filename = filePrefix + i + '.jpg';
//         images.push(window.location.href + urlPath + '/' + filename);
//     }

//     return <div>
//         <Header as='h3' dividing>
//             { hint }
//         </Header>
//         <Card.Group itemsPerRow={3}>
//             { images.map((img) => ImageModal(img)) }
//         </Card.Group>
//     </div>;
// }
