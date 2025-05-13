import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database'; // Usando onValue para escutar em tempo real
import { useAuth } from './useAuth'; // Hook de autenticação

type FirebaseQuestions = Record<string, {
  answer: null;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, { authorId: string }>;
}>;

type QuestionType = {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
  answer?: string | null;
  answerAuthor?: { // Adicione este campo
    name: string;
    avatar: string;
  };
};


type useRoomResponseType = {
  title: string;
  questions: QuestionType[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionType[]>>;
};

export const useRoom = (roomId: string): useRoomResponseType => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const roomRef = ref(db, `rooms/${roomId}`);

    // Usando onValue para escutar atualizações em tempo real
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const databaseRoom = snapshot.val();
      if (databaseRoom) {
        const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

        const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => ({
          id: key,
          content: value.content,
          author: value.author,
          isAnswered: value.isAnswered,
          isHighlighted: value.isHighlighted,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(
            ([_, like]) => like.authorId === user?.id
          )?.[0],
          answer: value.answer ?? null, // Garantindo que 'answer' pode ser null
        }));

        setTitle(databaseRoom.title);
        setQuestions(parsedQuestions); // Atualiza o estado com as perguntas
      }
    });

    // Remover o listener quando o componente for desmontado
    return () => unsubscribe();
  }, [roomId, user?.id]); // Atualiza quando o roomId ou user.id muda

  return { title, questions, setQuestions }; // Retorna as informações necessárias
};