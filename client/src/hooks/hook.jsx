import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";


const useErrors = (errors = []) => {
    useEffect(() => {
        errors.forEach(({isError , error , fallback}) => {
            if(isError){
                if(fallback) {
                    fallback();
                }
                else {
                    // Ensure we always display a string message
                    let errorMessage = "Something went wrong";
                    
                    if (error?.data?.message) {
                        errorMessage = typeof error.data.message === 'string' 
                            ? error.data.message 
                            : JSON.stringify(error.data.message);
                    } else if (error?.message) {
                        errorMessage = typeof error.message === 'string' 
                            ? error.message 
                            : JSON.stringify(error.message);
                    }
                    
                    toast.error(errorMessage);
                }
            }
        })

      
    },[errors]);
};


const useAsyncMutation = (mutationHook) => {

    const [isLoading , setIsLoading] = useState(false);
    const [data , setData] = useState(null);

    const [mutate] = mutationHook();

    const executeMutation = async(toastMessage , ...args) => {
        setIsLoading(true);
        const toastId = toast.loading(toastMessage || "Updating data...");

            try {
              const res = await mutate(...args);
              if(res.data){
                toast.success(res.data.message || "Updated data succesfully" , {
                    id: toastId
                });
                setData(res.data);
              }else{

                toast.error(res?.error?.data?.message || "Something went wrong" , {
                    id: toastId
                });
              }
            } catch (error) {
              console.log(error);
              toast.error("Something went wrong" , {
                id: toastId
              })
            } finally {
            setIsLoading(false);
            }
    }

    return [executeMutation , isLoading , data];
}


const useSocketEvent = (socket , handlers) => {

    useEffect(() => {

        Object.entries(handlers).forEach(([event , handler]) => {
          socket.on(event , handler);
        });
    
        return () => {
          Object.entries(handlers).forEach(([event , handler]) => {
            socket.off(event , handler);
          });
        }
      },[socket , handlers]);
}


export {useErrors , useAsyncMutation , useSocketEvent}