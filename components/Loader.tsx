import React from "react";
import ContentLoader, { Rect } from 'react-content-loader/native';

export default function Loader() {
    return (
        <ContentLoader
            viewBox="0 0 500 200"
            width={500}
            height={200}
            backgroundColor="#ababab"
            foregroundColor="#fafafa"
            title="Chargement des resultats de recherche..."
        >
            <Rect x="15" y="9.93" rx="5" ry="5" width="143.55" height="86.59" />
            <Rect x="162.84" y="9.67" rx="0" ry="0" width="170.0" height="12.12" />
            <Rect x="162.84" y="25.67" rx="0" ry="0" width="89" height="9" />

            <Rect x="15" y="107" rx="5" ry="5" width="143.55" height="86.59" />
            <Rect x="162.84" y="107" rx="0" ry="0" width="170.0" height="12.12" />
            <Rect x="162.84" y="123" rx="0" ry="0" width="89" height="9" />
        </ContentLoader>
    )
}

// News.metadata = {
//   name: 'Arthur Falcão',
//   github: 'arthurfalcao',
//   description: 'News List',
//   filename: 'News',
// }