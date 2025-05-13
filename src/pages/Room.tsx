import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import chatImg from '../assets/images/chat.png';
import { Question } from '../components/Question';
import { Button } from '../components/Button';
import { RoomCode } from '../components/roomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { getDatabase, ref, push, update } from 'firebase/database';

import '../styles/room.scss';

type RoomParams = {
  id: string;
};

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const roomId = params.id;
  const [responses, setResponses] = useState<Record<string, string>>({});

  const { title, questions } = useRoom(roomId);

  async function handleAnswerQuestion(questionId: string) {
    const response = responses[questionId]?.trim();
    if (!response) return;

    const db = getDatabase();
    const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`);

    await update(questionRef, {
      answer: response,
      isAnswered: true,
      answerAuthor: {
        name: user?.name,
        avatar: user?.avatar,
      },
    });

    setResponses((prev) => ({ ...prev, [questionId]: '' }));
  }

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    const db = getDatabase();
    const questionRef = ref(db, `rooms/${roomId}/questions`);
    await push(questionRef, question);

    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <a href="/">
            <img src={chatImg} height="100px" alt="Letmeask" />
          </a>
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: 8,
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Responder..."
                      value={responses[question.id] || ''}
                      onChange={(e) =>
                        setResponses((prev) => ({
                          ...prev,
                          [question.id]: e.target.value,
                        }))
                      }
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: 8,
                        border: '1px solid #ccc',
                      }}
                    />
                    <button
                      onClick={() => handleAnswerQuestion(question.id)}
                      style={{
                        marginLeft: 8,
                        backgroundColor: 'red',
                        color: '#fff',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Enviar
                    </button>
                  </div>
                </>
              )}

              {question.answer && (
                <div
                  style={{
                    marginTop: 10,
                    padding: '8px',
                    backgroundColor: '#f9f9f9',
                    borderLeft: '4px solid #4caf50',
                    borderRadius: '4px',
                    fontStyle: 'italic',
                  }}
                >
                  <strong>Resposta:</strong> {question.answer}
                  {question.answerAuthor && (
                    <div
                      style={{
                        marginTop: 8,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={question.answerAuthor.avatar}
                        alt={question.answerAuthor.name}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          marginRight: 8,
                        }}
                      />
                      <span>{question.answerAuthor.name}</span>
                    </div>
                  )}
                </div>
              )}
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
