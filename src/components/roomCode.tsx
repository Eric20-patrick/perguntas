import CopyImg from '../assets/images/copy.svg';
import '../styles/room-code.scss';

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {
  function copyRommCodeToClipboard() {
    navigator.clipboard.writeText(props.code);
  }

  return (
    <button className="room-code" onClick={copyRommCodeToClipboard}>
      <div>
        <img src={CopyImg} alt="Copy room code " />
      </div>
      <span> Sala #{props.code} </span>
    </button>
  );
}
