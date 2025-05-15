import React, { useEffect, useRef } from "react";
import { $badge_map } from "@content/shared/badge_data";
import { useStore } from "@nanostores/react";
import "@styles/hint.css";
import "@styles/badge_performed.css";

function Thematic_Area_Badge({ text_content = "-", limitless = "" }) {
   return (
      <li className="hint--top hint--rounded badge-thematicArea quiz-badge-li hint--info" aria-label={text_content}>
         <span className={"badge rounded-pill badge-primary quiz-badge " + limitless}>{text_content}</span>
      </li>
   );
}

function Content_Badge({ text_content = "-", limitless = "" }) {
   return (
      <li className="hint--top hint--rounded badge-content quiz-badge-li hint--warning " aria-label={text_content}>
         <span className={"badge rounded-pill badge-warning quiz-badge " + limitless}>{text_content}</span>
      </li>
   );
}

function Objective_Badge({ text_content = "-", limitless = "" }) {
   return (
      <li className="hint--top hint--rounded badge-objective quiz-badge-li hint--error " aria-label={text_content}>
         <span className={"badge rounded-pill badge-danger quiz-badge " + limitless}>{text_content}</span>
      </li>
   );
}

function Skill_Badge({ text_content = "-", limitless = "" }) {
   return (
      <li className="hint--top hint--rounded badge-skill quiz-badge-li hint--success" aria-label={text_content}>
         <span className={"badge rounded-pill badge-success quiz-badge " + limitless}>{text_content}</span>
      </li>
   );
}

function More_Badge({ labels_left = 0, onClick }: { labels_left: number; onClick: () => void }) {
   return (
      labels_left > 0 && (
         <li
            className="hint--top hint--small hint--rounded badge-skill quiz-badge-li"
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyPress={(e) => e.key === "Enter" && onClick()}
            aria-label={`Mostrar ${labels_left} más etiquetas`}
         >
            <span className="badge rounded-pill badge-primary quiz-badge quiz-badge-more">...</span>
            <span className="badge rounded-pill badge-notification">+ {labels_left}</span>
         </li>
      )
   );
}

function Label_Container({ children, label }) {
   return (
      <section className="quiz-label-container">
         <p>{label}</p>
         <ul>{children}</ul>
      </section>
   );
}

const Badge_Modal = React.forwardRef<HTMLDialogElement, { badges }>(({ badges }, ref) => {
   const { thematic_area, content, objective, skill } = badges;

   useEffect(() => {
      const dialog = (ref as React.RefObject<HTMLDialogElement>).current;
      const handleClick = (event: MouseEvent) => {
         if (!dialog) return;

         // Verifica si el clic fue directamente en el fondo del <dialog> (y no dentro del contenido)
         if (event.target === dialog) {
            dialog.close();
         }
      };

      dialog?.addEventListener("click", handleClick);
      return () => dialog?.removeEventListener("click", handleClick);
   }, [ref]);

   return (
      <dialog id="badge-modal" ref={ref}>
         <div id="badge-modal-container">
            <button
               id="close-badge-modal"
               type="button"
               className="btn-close"
               aria-label="Close"
               onClick={() => (ref as React.RefObject<HTMLDialogElement>).current?.close()}
            ></button>
            <Label_Container
               label="Ejes temáticos"
               children={thematic_area.map((item, i) => (
                  <Thematic_Area_Badge key={i} text_content={item} limitless="quiz-badge-limitless" />
               ))}
            />
            <Label_Container
               label="Contenidos"
               children={content.map((item, i) => (
                  <Content_Badge key={i} text_content={item} limitless="quiz-badge-limitless" />
               ))}
            />
            <Label_Container
               label="Objetivos"
               children={objective.map((item, i) => (
                  <Objective_Badge key={i} text_content={item} limitless="quiz-badge-limitless" />
               ))}
            />
            <Label_Container
               label="Habilidades"
               children={skill.map((item, i) => (
                  <Skill_Badge key={i} text_content={item} limitless="quiz-badge-limitless" />
               ))}
            />
         </div>
      </dialog>
   );
});

export default function Badge_Container() {
   const $badge_map_store = useStore($badge_map);
   const dialogRef = useRef<HTMLDialogElement>(null);

   const total =
      $badge_map_store.thematic_area.length +
      $badge_map_store.content.length +
      $badge_map_store.objective.length +
      $badge_map_store.skill.length;
   const shown =
      Math.min($badge_map_store.thematic_area.length, 3) +
      Math.min($badge_map_store.content.length, 3) +
      Math.min($badge_map_store.skill.length, 3) +
      Math.min($badge_map_store.objective.length, 2);
   const labels_left = total - shown;

   return (
      <>
         {$badge_map_store.thematic_area.slice(0, 3).map((item, i) => (
            <Thematic_Area_Badge key={i} text_content={item} />
         ))}

         {$badge_map_store.content.slice(0, 3).map((item, i) => (
            <Content_Badge key={i} text_content={item} />
         ))}

         {$badge_map_store.skill.slice(0, 3).map((item, i) => (
            <Skill_Badge key={i} text_content={item} />
         ))}

         {$badge_map_store.objective.slice(0, 2).map((item, i) => (
            <Objective_Badge key={i} text_content={item} />
         ))}

         <More_Badge labels_left={labels_left} onClick={() => dialogRef.current?.showModal()} />

         <Badge_Modal ref={dialogRef} badges={$badge_map_store} />
      </>
   );
}
