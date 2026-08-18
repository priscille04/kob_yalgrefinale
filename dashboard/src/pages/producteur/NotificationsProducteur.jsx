import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Loader2, Bell, BellOff, MessageCircle, Check, Trash2 } from 'lucide-react';

export default function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        chargerNotifications();
    }, []);


    // Charger uniquement les notifications du producteur connecté
    const chargerNotifications = async () => {
        try {

            const { data } = await api.get('/v1/notifications');

            setNotifications(
                data.data || data || []
            );

        } catch (error) {

            console.error(
                "Erreur chargement notifications :",
                error
            );

        } finally {

            setLoading(false);

        }
    };



    // Marquer comme lue
    const marquerCommeLu = async (notification) => {

        try {

            await api.put(
                `/v1/notifications/${notification.id}`,
                {
                    lu: true
                }
            );


            setNotifications(
                notifications.map((n)=>
                    n.id === notification.id
                    ?
                    {
                        ...n,
                        lu:true
                    }
                    :
                    n
                )
            );


        } catch(error){

            console.error(error);

        }

    };



    // Supprimer une notification
    const supprimerNotification = async(id)=>{

        try{

            await api.delete(
                `/v1/notifications/${id}`
            );


            setNotifications(
                notifications.filter(
                    n=>n.id!==id
                )
            );


        }catch(error){

            console.error(error);

        }

    };



    if(loading){

        return (

            <div className="flex justify-center items-center h-64">

                <Loader2 className="animate-spin text-green-600 w-8 h-8"/>

            </div>

        );

    }



    const nonLues =
        notifications.filter(
            n=>!n.lu
        ).length;    return (

        <div className="space-y-6">


            {/* HEADER */}
            <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                    <h1 className="text-2xl font-bold text-gray-900">
                        Notifications
                    </h1>


                    {nonLues > 0 && (

                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">

                            {nonLues} nouveau(x)

                        </span>

                    )}

                </div>


                <Bell className="text-green-600 w-7 h-7"/>

            </div>



            {/* LISTE NOTIFICATIONS */}

            <div className="space-y-4">


                {
                    notifications.length === 0 && (

                        <div className="text-center py-12 text-gray-400">

                            <BellOff className="mx-auto mb-3 w-10 h-10"/>

                            <p>
                                Aucune notification pour le moment.
                            </p>

                        </div>

                    )
                }



                {
                    notifications.map((notification)=>(


                        <div
                            key={notification.id}
                            className={`
                            bg-white rounded-xl border p-5 shadow-sm
                            flex gap-4 items-start
                            ${
                                notification.lu
                                ?
                                "border-gray-200"
                                :
                                "border-green-400 bg-green-50"
                            }
                            `}
                        >


                            {/* ICON */}

                            <div
                                className={`
                                w-12 h-12 rounded-full flex items-center justify-center
                                ${
                                    notification.lu
                                    ?
                                    "bg-gray-100"
                                    :
                                    "bg-green-100"
                                }
                                `}
                            >

                                {
                                    notification.conversation_id
                                    ?
                                    <MessageCircle className="text-green-600"/>
                                    :
                                    <Bell className="text-green-600"/>
                                }


                            </div>




                            {/* CONTENU */}

                            <div className="flex-1">


                                <h3 className="font-bold text-gray-900">

                                    {notification.titre}

                                </h3>



                                <p className="text-gray-600 text-sm mt-1">

                                    {notification.message}

                                </p>




                                {
                                    notification.created_at && (

                                        <p className="text-xs text-gray-400 mt-2">

                                            {
                                                new Date(
                                                    notification.created_at
                                                )
                                                .toLocaleString("fr-FR")
                                            }

                                        </p>

                                    )
                                }




                                {/* BOUTON REPONDRE */}

                                {
                                    notification.conversation_id && (

                                        <button

                                            onClick={()=>{

                                                marquerCommeLu(notification);


                                                window.location.href =
                                                `/conversation/${notification.conversation_id}`;

                                            }}

                                            className="
                                            mt-4
                                            bg-green-600
                                            hover:bg-green-700
                                            text-white
                                            px-4
                                            py-2
                                            rounded-lg
                                            text-sm
                                            font-semibold
                                            flex
                                            items-center
                                            gap-2
                                            "

                                        >

                                            <MessageCircle size={16}/>

                                            Répondre au client

                                        </button>

                                    )

                                }


                            </div>





                            {/* ACTIONS */}

                            <div className="flex flex-col gap-2">


                                {
                                    !notification.lu && (

                                        <button

                                            onClick={()=>
                                                marquerCommeLu(notification)
                                            }

                                            className="
                                            text-green-600
                                            hover:text-green-800
                                            "
                                            title="Marquer comme lu"

                                        >

                                            <Check size={20}/>

                                        </button>

                                    )
                                }




                                <button

                                    onClick={()=>
                                        supprimerNotification(
                                            notification.id
                                        )
                                    }

                                    className="
                                    text-red-500
                                    hover:text-red-700
                                    "

                                    title="Supprimer"

                                >

                                    <Trash2 size={20}/>

                                </button>



                            </div>



                        </div>


                    ))
                }


            </div>


        </div>

    );

}