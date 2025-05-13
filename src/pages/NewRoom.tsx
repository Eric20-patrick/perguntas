import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import IllustrationImg from '../assets/images/illustration.svg';
import LogoImg from '../assets/images/logo.svg';
import GoogleIconImg from '../assets/images/google-icon.svg';
import { Button } from '../components/Button';
import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { ref, push } from 'firebase/database'; // Importando as funções corretas
import { database } from '../services/firebase'; // Apenas importando o database

export function NewRoom() {
  const { user } = useAuth(); // Obtendo o usuário do contexto
  const history = useHistory(); // Utilizando o history para navegação
  const [newRoom, setNewRoom] = useState(''); // Gerenciando o estado do nome da sala

  // Função para criar uma nova sala
  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return; // Impede de criar sala sem nome
    }

    // Referência para a coleção de salas no banco de dados
    const roomRef = ref(database, 'rooms');

    // Adiciona a nova sala ao banco de dados
    const firebaseRoom = await push(roomRef, {
      title: newRoom,
      authorId: user?.id, // Definindo o ID do usuário como o autor
    });

    // Redireciona para a sala recém-criada
    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <main>
        <div className="main-content">
          <img src={LogoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
