import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService";
import AuthForm from "./AuthForm";

const RegisterPage = () => {
    const [apiError, setApiError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
}