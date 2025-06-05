pipeline{
    agent { label 'dev-server' }
    
    stages{
        stage("Code Clone"){
            steps{
                echo "Code Clone Stage"
                git url: "https://github.com/vaibhav-sarode17/node-todo-project.git", branch: "master"
            }
        }
        stage("Code Build & Test"){
            steps{
                echo "Code Build Stage"
                sh "docker build -t node-app ."
            }
        }
        stage("Push To DockerHub"){
            steps{
                withCredentials([usernamePassword(
                    credentialsId:"DockerHubCreds",
                    usernameVariable:"DockerHubUser", 
                    passwordVariable:"DockerHubPass")]){
                sh 'echo $DockerHubPass | docker login -u $DockerHubUser --password-stdin'
                sh "docker image tag node-app:latest ${env.DockerHubUser}/node-app:latest"
                sh "docker push ${env.DockerHubUser}/node-app:latest"
                }
            }
        }
        stage("Deploy"){
            steps{
                sh "docker compose down && docker compose up -d --build"
            }
        }
    }
}
