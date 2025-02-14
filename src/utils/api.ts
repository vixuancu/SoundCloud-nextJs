import queryString from "query-string";

export const sendRequest = async <T>(props: IRequest) => {
  //Cho phép function trả về bất kỳ kiểu dữ liệu nào (T).
  let {
    url,
    method,
    body,
    queryParams = {},
    useCredentials = false,
    headers = {},
    nextOption = {},
  } = props;

  const options: any = {
    method: method,
    // by default setting the content-type to be json type
    headers: new Headers({ "content-type": "application/json", ...headers }),
    body: body ? JSON.stringify(body) : null,
    ...nextOption,
  };
  if (useCredentials) options.credentials = "include";

  if (queryParams) {
    url = `${url}?${queryString.stringify(queryParams)}`;
  }

  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json() as T;
    } else {
      return res.json().then(function (json) {
        // to be able to access error status when you catch the error
        return {
          statusCode: res.status,
          message: json?.message ?? "",
          error: json?.error ?? "",
        } as T;
      });
    }
  });
};
export const sendRequestFile = async <T>(props: IRequest) => {
  //Cho phép function trả về bất kỳ kiểu dữ liệu nào (T).
  let {
    url,
    method,
    body,
    queryParams = {},
    useCredentials = false,
    headers = {},
    nextOption = {},
  } = props;

  const options: any = {
    method: method,
    // by default setting the content-type to be json type
    headers: new Headers({ ...headers }),
    body: body ? body : null,
    ...nextOption,
  };
  if (useCredentials) options.credentials = "include";

  if (queryParams) {
    url = `${url}?${queryString.stringify(queryParams)}`;
  }

  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json() as T;
    } else {
      return res.json().then(function (json) {
        // to be able to access error status when you catch the error
        return {
          statusCode: res.status,
          message: json?.message ?? "",
          error: json?.error ?? "",
        } as T;
      });
    }
  });
};
export const fetchDefaultImage = (type: string) => {
  // lấy hình ảnh trong thư mục public chỉ cần khai báo tên thư mục bên trong và đường dẫn tới file ảnh
  if (type === "GITHUB") return "/user/default-github.png";
  if (type === "GOOGLE") return "/user/default-google.png";
  return "/user/default-user.png";
};
