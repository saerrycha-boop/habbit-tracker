import { Habit } from "./types";

export const INITIAL_HABITS: Habit[] = [
  {
    id: "1",
    name: "일찍 일어나기",
    goal: 7,
    completedDays: [true, false, true, true, false, false, true, true, true, false, false, true, false, false, true, true, false, false, true, false, true, true, false, false, true, false, false, true]
  },
  {
    id: "2",
    name: "방 정리하기",
    goal: 7,
    completedDays: [false, true, false, true, true, false, false, false, true, true, true, false, false, true, false, false, false, true, false, true, false, false, true, false, false, true, false, false]
  },
  {
    id: "3",
    name: "20분 걷기",
    goal: 5,
    completedDays: [true, true, true, false, false, true, false, true, true, true, false, false, true, false, true, true, true, false, false, true, false, true, true, true, false, false, true, false]
  },
  {
    id: "4",
    name: "책 5페이지 읽기",
    goal: 7,
    completedDays: Array(28).fill(false).map((_, i) => i % 3 === 0)
  },
  {
    id: "5",
    name: "감사일기 3줄 쓰기",
    goal: 6,
    completedDays: Array(28).fill(false)
  },
  {
    id: "6",
    name: "새로운 것 1시간 배우기",
    goal: 5,
    completedDays: Array(28).fill(false)
  },
  {
    id: "7",
    name: "영화 1시간 보기",
    goal: 7,
    completedDays: Array(28).fill(false)
  },
  {
    id: "8",
    name: "할 일 목록 체크",
    goal: 7,
    completedDays: Array(28).fill(false)
  },
  {
    id: "9",
    name: "식단 준비하기",
    goal: 7,
    completedDays: Array(28).fill(false)
  },
  {
    id: "10",
    name: "운동하기",
    goal: 5,
    completedDays: Array(28).fill(false)
  }
];

export const DAYS_OF_WEEK = ['월', '화', '수', '목', '금', '토', '일'];
