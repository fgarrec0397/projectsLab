import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export type FetchRequestConfig<Data = any> = AxiosRequestConfig<Data>;
export type FetchResponse<Data = any> = AxiosResponse<Data>;

export class Fetcher {
    static async get<DataType = any, ResponseType = DataType>(
        endpoint: string,
        config?: FetchRequestConfig<DataType>
    ) {
        const response = axios.get<DataType, FetchResponse<ResponseType>>(endpoint, config);
        return (await response).data;
    }

    static async post<DataType = any, ResponseType = DataType>(
        endpoint: string,
        data: DataType,
        config?: FetchRequestConfig<DataType>
    ) {
        const response = await axios.post<DataType, FetchResponse<ResponseType>>(
            endpoint,
            data,
            config
        );
        return response.data;
    }

    static async delete<DataType = any, ResponseType = DataType>(
        endpoint: string,
        config: FetchRequestConfig<DataType>
    ) {
        const response = axios.delete<DataType, FetchResponse<ResponseType>>(endpoint, config);
        return response;
    }

    static async patch<DataType = any, ResponseType = DataType>(
        endpoint: string,
        config: FetchRequestConfig<DataType>
    ) {
        const response = axios.patch<DataType, ResponseType>(endpoint, config);
        return response;
    }

    static async put<DataType = any, ResponseType = DataType>(
        endpoint: string,
        config: FetchRequestConfig<DataType>
    ) {
        const response = axios.put<DataType, ResponseType>(endpoint, config);
        return response;
    }
}
