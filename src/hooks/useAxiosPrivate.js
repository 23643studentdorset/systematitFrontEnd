import { axiosPrivate } from "../Api/axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const { auth } = useAuth();

    useEffect(() => {
        const requestIncerptor = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.Token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        )
        return() => {
            axiosPrivate.interceptors.request.eject(requestIncerptor);
        }
    }, [auth])

    return axiosPrivate;
}

export default useAxiosPrivate;