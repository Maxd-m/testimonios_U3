import React from "react";

export default function Testimonial({item}){
    const {nombre, cargo, texto, foto} = item;
    return(
        <article className="testimonial-card">
            <img src={foto} alt={nombre} className="testimonial-photo"/>
            <h3 className="testimonial -name">{nombre}</h3>
            <p className="testimonial-role">{cargo}</p>
            <p className="testimonial-text">{texto}</p>
        </article>
    )
}