variable "function_name" {
  type = string
  default = "InvokeTestLambda"
}

module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = var.function_name
  description = "Test Lambda Function for aws-actions-invoke-lambda"

  handler = "handler.handler"
  runtime = "nodejs14.x"

  source_path = "./handler.js"

  tags = {
    Product =  "aws-actions-invoke-lambda"
    Environment = "test"
  }
}
