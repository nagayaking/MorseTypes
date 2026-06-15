import React from "react";

interface Props {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function Button({ href, onClick, children: children }: Props) {
  return (
    <a href={ href } className="btn" onClick={ onClick }>
      <div>
        { children }
      </div>
    </a>
  );
}