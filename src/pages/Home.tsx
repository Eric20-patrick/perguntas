import { useHistory } from 'react-router-dom';
import { auth, database } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import chatImg from '../assets/images/chat.png';
import novoo from '../assets/images/novoo.png';
import googleIcoImg from '../assets/images/google-icon.svg';
import { Button } from '../components/Button';
import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';

import { ref, get } from 'firebase/database';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = ref(database, `rooms/${roomCode}`);

    const roomSnapshot = await get(roomRef);

    if (!roomSnapshot.exists()) {
      alert('Room does not exist.');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <main>
        <div className="main-content">
          <img src={novoo} height={200} width={400} alt="Perguntas" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIcoImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
