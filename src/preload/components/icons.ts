import { html } from '@preload/utils/component'

export const Close = html` <svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
>
  <rect width="24" height="24" fill="none" />
  <g fill="none" fill-rule="evenodd">
    <path
      d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
    />
    <path
      fill="white"
      d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"
    />
  </g>
</svg>`

export const Minimize = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
>
  <rect width="24" height="24" fill="none" />
  <path fill="white" d="M18 11H6a2 2 0 0 0 0 4h12a2 2 0 0 0 0-4" />
</svg>`

export const Danmu = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
>
  <rect width="24" height="24" fill="none" />
  <path
    fill="white"
    fill-rule="evenodd"
    d="M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12S17.937 22.75 12 22.75c-1.856 0-3.605-.471-5.13-1.3l-4.233.787a.75.75 0 0 1-.874-.874l.788-4.233A10.705 10.705 0 0 1 1.25 12m6-2A.75.75 0 0 1 8 9.25h8a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75M8 13.25a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5h-2z"
    clip-rule="evenodd"
  />
</svg>`

export const Pin = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
>
  <rect width="24" height="24" fill="none" />
  <g fill="none" stroke="white" stroke-width="2">
    <path
      fill="white"
      d="M14.636 3.91c.653-.436.98-.654 1.335-.618c.356.035.633.312 1.188.867l2.682 2.682c.555.555.832.832.867 1.188c.036.356-.182.682-.617 1.335l-1.65 2.473c-.561.843-.842 1.264-1.066 1.714a8.005 8.005 0 0 0-.427 1.031c-.16.477-.26.974-.458 1.967l-.19.955l-.002.006a1 1 0 0 1-1.547.625l-.005-.004l-.027-.018a35 35 0 0 1-8.85-8.858l-.004-.006a1 1 0 0 1 .625-1.547l.006-.001l.955-.191c.993-.199 1.49-.298 1.967-.458a7.997 7.997 0 0 0 1.03-.427c.45-.224.872-.505 1.715-1.067z"
    />
    <path stroke-linecap="round" d="m5 19l4.5-4.5" />
  </g>
</svg>`

export const Pined = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
>
  <rect width="24" height="24" fill="none" />
  <g fill="none">
    <path
      fill="white"
      d="M8 4.461c0-.43 0-.644.065-.815a1 1 0 0 1 .58-.581C8.818 3 9.033 3 9.462 3h5.078c.43 0 .644 0 .815.065a1 1 0 0 1 .581.58c.065.172.065.387.065.816v.218c0 .89 0 1.335.047 1.77c.108.983.397 1.938.853 2.816c.201.387.448.757.942 1.498l1.038 1.557a1.423 1.423 0 0 1-.84 2.17a24.907 24.907 0 0 1-12.08 0a1.423 1.423 0 0 1-.84-2.17l1.038-1.557c.494-.74.74-1.11.942-1.498a8 8 0 0 0 .852-2.817C8 6.014 8 5.57 8 4.68z"
    />
    <path stroke="white" stroke-linecap="round" stroke-width="2" d="M12 20v-6.5" />
    <path stroke="white" stroke-width="2" d="M6 20h12" />
  </g>
</svg>`

export const Refresh = html`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="lucide lucide-refresh-cw"
>
  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
  <path d="M21 3v5h-5" />
  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
  <path d="M8 16H3v5" />
</svg>`
