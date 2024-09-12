import React from 'react';

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle
} from './../components/styles'

const Login = () => {
    return (
        <StyledContainer>
            <InnerContainer>
                <PageLogo resizeModue="cover" source={require('./../assets/gardensbtb.png')}/>
                <PageTitle>Go Touch Grass</PageTitle>
            </InnerContainer>
        </StyledContainer>
    );
}

export default Login;