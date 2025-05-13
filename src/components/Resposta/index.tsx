import { ReactNode } from 'react';
import cx from 'classnames';

type RespostasProps = {
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
};
export function Respostas({
  author,
  isAnswered = false,
  isHighlighted = false,
  children,
}: RespostasProps) {
  return (
    <div
      className={cx(
        'resposta',
        { answered: isAnswered },
        { highlighted: isHighlighted && !isAnswered }
      )}
    >
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}
