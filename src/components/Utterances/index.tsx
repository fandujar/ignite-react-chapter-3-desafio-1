import { useEffect, useState, useRef } from "react";

type UtterancesProps = {
    repo: string;
    issueTerm?: "pathname" | "url" | "title" | "og:title" | string;
    issueNumber?: number;
    label?: string;
    theme: string;
    crossorigin: string;
    className?: string;
}

export const Utterances = (props: UtterancesProps) => {
    const libURL = "https://utteranc.es/client.js";

    useEffect(() => {
        const script = document.createElement('script');
        script.src = libURL;
        script.setAttribute('repo', props.repo);
        script.setAttribute('issue-term', props.issueTerm);
        script.setAttribute('theme', props.theme);
        script.setAttribute('crossorigin', props.crossorigin);
        script.async = true;
        
        const utterancesContainer = document.getElementById('utterances-container')
        utterancesContainer && utterancesContainer.appendChild(script)

        return () => {
            const comments = document.getElementById('utterances-container');
            if (comments) comments.innerHTML = '';
        };
    }, [])
    
    return(
        <div id="utterances-container" className={props.className}>
        </div>
    )
}