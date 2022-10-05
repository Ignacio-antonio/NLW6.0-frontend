import { useParams, Link, useNavigate } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import { RoomCode } from '../components/RoomCode';
import { Button } from '../components/Button';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import '../styles/room.scss';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';


type RoomParams = {
    id: string;
  }
  
  export function AdminRoom() {
    const history = useNavigate();
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;
  
    const { title, questions } = useRoom(roomId as any)

    async function handleEndRoom () {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history('/');
    }

    async function handleDeleteQuestion (questionId: string) {
       if (window.confirm('Tem certeza de que você deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
       }
    }

    async function handleCheckQuestionAsAnswered (questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });
       
    }
    
    async function handleHighlightQuestion (questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />
                    <div>
                    <RoomCode code='' />
                    <Button onClick={handleEndRoom} isOutlined>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return(
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                            
                            {!question.isAnswered && (
                                <>
                                <button
                                type="button"
                                onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                >
                                <img src={checkImg} alt="Marcar pergunta como respondida" />
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => handleHighlightQuestion(question.id)}
                                >
                                <img src={answerImg} alt="Dar destaque á pergunta" />
                            </button>
                            </>
                            )}
                            
                            <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                                >
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}