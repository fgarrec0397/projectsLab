import { memo } from "react";

// ----------------------------------------------------------------------

function FreePlanIcon() {
    return (
        <svg
            width="51"
            height="28"
            viewBox="0 0 51 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M50.5792 13.8536C50.5792 14.1022 50.5626 14.3259 50.5294 14.5248H45.4953C45.5367 15.022 45.7107 15.4115 46.0174 15.6932C46.324 15.975 46.701 16.1158 47.1485 16.1158C47.7948 16.1158 48.2548 15.8382 48.5282 15.283H50.4051C50.2063 15.946 49.8251 16.4929 49.2616 16.9238C48.6981 17.3464 48.0062 17.5577 47.1858 17.5577C46.5228 17.5577 45.9262 17.4127 45.3958 17.1227C44.8738 16.8244 44.4636 16.4059 44.1653 15.8672C43.8752 15.3286 43.7302 14.7071 43.7302 14.0027C43.7302 13.2901 43.8752 12.6644 44.1653 12.1258C44.4553 11.5872 44.8614 11.1728 45.3834 10.8828C45.9055 10.5928 46.5063 10.4478 47.1858 10.4478C47.8404 10.4478 48.4246 10.5886 48.9384 10.8704C49.4605 11.1521 49.8624 11.554 50.1441 12.0761C50.4342 12.5899 50.5792 13.1824 50.5792 13.8536ZM48.7768 13.3564C48.7685 12.9089 48.6069 12.5526 48.292 12.2874C47.9772 12.0139 47.5918 11.8772 47.1361 11.8772C46.7051 11.8772 46.3405 12.0098 46.0422 12.275C45.7522 12.5319 45.574 12.8923 45.5077 13.3564H48.7768Z"
                fill="#333333"
            />
            <path
                d="M42.9077 13.8536C42.9077 14.1022 42.8911 14.3259 42.8579 14.5248H37.8238C37.8652 15.022 38.0392 15.4115 38.3458 15.6932C38.6524 15.975 39.0295 16.1158 39.477 16.1158C40.1233 16.1158 40.5832 15.8382 40.8567 15.283H42.7336C42.5348 15.946 42.1536 16.4929 41.5901 16.9238C41.0266 17.3464 40.3346 17.5577 39.5143 17.5577C38.8513 17.5577 38.2547 17.4127 37.7243 17.1227C37.2023 16.8244 36.7921 16.4059 36.4938 15.8672C36.2037 15.3286 36.0587 14.7071 36.0587 14.0027C36.0587 13.2901 36.2037 12.6644 36.4938 12.1258C36.7838 11.5872 37.1898 11.1728 37.7119 10.8828C38.234 10.5928 38.8348 10.4478 39.5143 10.4478C40.1689 10.4478 40.7531 10.5886 41.2669 10.8704C41.789 11.1521 42.1909 11.554 42.4726 12.0761C42.7626 12.5899 42.9077 13.1824 42.9077 13.8536ZM41.1053 13.3564C41.097 12.9089 40.9354 12.5526 40.6205 12.2874C40.3056 12.0139 39.9203 11.8772 39.4645 11.8772C39.0336 11.8772 38.669 12.0098 38.3707 12.275C38.0807 12.5319 37.9025 12.8923 37.8362 13.3564H41.1053Z"
                fill="#333333"
            />
            <path
                d="M33.2208 11.6285C33.4445 11.2639 33.7346 10.978 34.0909 10.7708C34.4555 10.5637 34.8698 10.4601 35.3339 10.4601V12.2873H34.874C34.3271 12.2873 33.9127 12.4157 33.631 12.6726C33.3575 12.9295 33.2208 13.377 33.2208 14.0151V17.4458H31.4806V10.5595H33.2208V11.6285Z"
                fill="#333333"
            />
            <path
                d="M30.353 11.9891H29.1473V17.4458H27.3822V11.9891H26.5991V10.5596H27.3822V10.2116C27.3822 9.36633 27.6225 8.74483 28.1032 8.34707C28.5838 7.94931 29.3089 7.76286 30.2784 7.78772V9.25446C29.8558 9.24617 29.5616 9.31661 29.3959 9.46577C29.2301 9.61493 29.1473 9.88425 29.1473 10.2737V10.5596H30.353V11.9891Z"
                fill="#333333"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.9068 8.39031C16.9568 7.93372 15.8757 7.67328 14.7108 7.67328C10.6336 7.67328 7.58328 10.8638 7.58328 14.4888C7.58328 18.114 10.6336 21.3044 14.7108 21.3044C16.5566 21.3044 18.1919 20.6505 19.4291 19.5984L25.1946 23.3027C22.6581 26.179 18.9022 28 14.7108 28C7.07165 28 0.878906 21.9509 0.878906 14.4888C0.878906 7.02683 7.07165 0.977661 14.7108 0.977661C17.8768 0.977661 20.7943 2.01668 23.1256 3.76468L17.9068 8.39031Z"
                fill="#D6D6D6"
            />
            <path
                d="M4.00849 11.1533C3.35967 9.47937 3.35967 7.69747 3.73809 6.23956C5.52232 3.37772 7.90125 2.0818 11.0372 1.43384C9.73954 2.94575 8.60422 8.18345 8.17168 11.6932C8.17168 11.6932 7.19847 13.9611 7.84728 16.283C4.27882 12.9352 4.00849 11.1533 4.00849 11.1533Z"
                fill="#ACACAC"
            />
            <path
                d="M12.6593 7.96748C13.4162 6.34757 16.0115 2.89177 19.9043 1.97382C18.2282 1.10988 14.065 0.5159 11.0373 1.43385C9.25303 2.56779 6.81997 3.97171 6.98219 10.3973C6.98219 10.3973 7.14441 12.2332 7.73914 12.9892C8.11761 11.6393 8.44204 11.2613 8.44204 11.2613C9.52339 9.3714 11.2536 8.39946 12.6593 7.96748Z"
                fill="#818181"
            />
            <path
                d="M11.0439 8.66938C12.1794 5.80755 16.5808 1.87251 18.4191 1.44055C21.0565 2.14926 23.1483 3.75572 23.1483 3.75572L17.9037 8.39945C15.3626 7.48145 13.8014 7.6434 11.0439 8.66938Z"
                fill="#333333"
            />
        </svg>
    );
}

export default memo(FreePlanIcon);